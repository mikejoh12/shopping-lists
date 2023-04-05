package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/mikejoh12/go-todo/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewListItemReq struct {
	Name        string `json:"name"`
	ListId      string `json:"listId"`
	IsCompleted bool   `json:"isCompleted"`
}

type ShoppingListReq struct {
	ID    string        `json:"id"`
	Name  string        `json:"name" bson:"name"`
	Items []ListItemReq `json:"items"`
}

type ListItemReq struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	IsCompleted bool   `json:"isCompleted"`
}

type ShoppingListsResource struct{}

func (rs ShoppingListsResource) Routes() chi.Router {
	r := chi.NewRouter()
	r.Use(jwtauth.Verifier(tokenAuth))
	r.Use(Authenticator)

	r.Post("/", rs.CreateList)
	r.Get("/", rs.GetLists)
	r.Delete("/{id}", rs.DeleteList)
	r.Post("/checkout/{id}", rs.CheckoutList)

	r.Route("/bulk", func(r chi.Router) {
		r.Post("/", rs.AddLists)
	})

	r.Route("/items", func(r chi.Router) {
		r.Post("/", rs.CreateListItem)
		r.Delete("/{id}", rs.DeleteListItem)
		r.Put("/{id}", rs.UpdateListItem)
	})

	return r
}

// GetLists sends all shopping lists as a json response
func (rs ShoppingListsResource) GetLists(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	objId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	items, err := models.AllShoppingLists(objId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(items); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
}

// CreateList creates a new shopping list from json data
func (rs ShoppingListsResource) CreateList(w http.ResponseWriter, r *http.Request) {
	l := struct{ Name string }{}
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	id, err := models.AddNewShoppingList(l.Name, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(struct {
		Name string `json:"name"`
		Id   string `json:"id"`
	}{l.Name, id})
}

// DeleteList deletes a shopping list from a list id in the URL params
func (rs ShoppingListsResource) DeleteList(w http.ResponseWriter, r *http.Request) {
	listId := chi.URLParam(r, "id")

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.RemoveList(listId, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// AddLists adds a slice of new shopping lists to the current users lists
func (rs ShoppingListsResource) AddLists(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	var lists []ShoppingListReq
	if err := json.NewDecoder(r.Body).Decode(&lists); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	var dbLists []models.ShoppingList
	for _, l := range lists {
		newList := models.ShoppingList{
			ID:      primitive.NewObjectID(),
			OwnerId: ownerId,
			Name:    l.Name,
			Items:   make([]models.ListItem, 0),
		}
		for _, item := range l.Items {
			newItem := models.ListItem{
				ID:          primitive.NewObjectID(),
				Name:        item.Name,
				IsCompleted: item.IsCompleted,
			}
			newList.Items = append(newList.Items, newItem)
		}
		dbLists = append(dbLists, newList)
	}

	err = models.AddShoppingLists(dbLists, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// CheckoutList removes completed items from a shopping list
func (rs ShoppingListsResource) CheckoutList(w http.ResponseWriter, r *http.Request) {
	listId := chi.URLParam(r, "id")
	fmt.Println("Got request for checkout with id", listId)
	listObjId, err := primitive.ObjectIDFromHex(listId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	err = models.CheckoutList(listObjId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
}

// CreateListItem creates a new list item from json data
func (rs ShoppingListsResource) CreateListItem(w http.ResponseWriter, r *http.Request) {
	var itemData NewListItemReq
	if err := json.NewDecoder(r.Body).Decode(&itemData); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	listId, err := primitive.ObjectIDFromHex(itemData.ListId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.AddListItem(itemData.Name, ownerId, listId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

// DeleteListItem deletes a list item based on the id
func (rs ShoppingListsResource) DeleteListItem(w http.ResponseWriter, r *http.Request) {
	todoId := chi.URLParam(r, "id")

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = models.RemoveListItem(todoId, ownerId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// UpdateListItem updates a list item based on the id
func (rs ShoppingListsResource) UpdateListItem(w http.ResponseWriter, r *http.Request) {
	listItemId := chi.URLParam(r, "id")

	_, claims, _ := jwtauth.FromContext(r.Context())
	ownerId, err := primitive.ObjectIDFromHex(claims["userId"].(string))
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	// Add logic to update db
	var itemData NewListItemReq
	if err := json.NewDecoder(r.Body).Decode(&itemData); err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	liId, err := primitive.ObjectIDFromHex(listItemId)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	li := models.ListItem{
		ID:          liId,
		Name:        itemData.Name,
		IsCompleted: itemData.IsCompleted,
	}

	err = models.ModifyListItem(ownerId, li)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
