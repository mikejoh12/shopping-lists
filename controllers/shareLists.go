package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/mikejoh12/go-todo/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ShareListsResource struct{}

type ShareListReq struct {
	ListId   string `json:"listId"`
	UserName string `json:"userName"`
}

type HandleShareReq struct {
	ListId      string `json:"listId"`
	IsAccepting bool   `json:"isAccepting"`
}

func (rs ShareListsResource) Routes() chi.Router {
	r := chi.NewRouter()
	r.Use(jwtauth.Verifier(tokenAuth))
	r.Use(Authenticator)

	r.Get("/", rs.GetShareInviteLists)
	r.Post("/create", rs.CreateShareRequest)
	r.Post("/respond", rs.RespondToShareRequest)

	return r
}

// GetShareInviteLists returns all lists where the user is invited to share the list
func (rs ShareListsResource) GetShareInviteLists(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	items, err := models.AllShareInviteShoppingLists(ownerId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(items); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

// CreateShareRequest initiates a new request from a user to share their list with a target user
func (rs ShareListsResource) CreateShareRequest(w http.ResponseWriter, r *http.Request) {
	var s ShareListReq
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	listId, err := primitive.ObjectIDFromHex(s.ListId)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	userId, err := models.GetUserIdByName(s.UserName)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = models.AddShareInvite(ownerId, listId, userId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// RespondtoShareRequest either accepts or removes a request to share a list with the current user
func (rs ShareListsResource) RespondToShareRequest(w http.ResponseWriter, r *http.Request) {
	var h HandleShareReq
	if err := json.NewDecoder(r.Body).Decode(&h); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	listId, err := primitive.ObjectIDFromHex(h.ListId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var success bool
	if h.IsAccepting {
		success, err = models.ShareListWithUser(listId, userId)
	} else {
		success, err = models.DeclineShareListWithUser(listId, userId)
	}

	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if success {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}
