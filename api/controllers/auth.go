package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"

	"github.com/mikejoh12/go-todo/config"
	"github.com/mikejoh12/go-todo/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type AuthResource struct{}

type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

var tokenAuth *jwtauth.JWTAuth

func init() {
	tokenAuth = jwtauth.New("HS256", []byte("secret"), nil)
}

// HashPassword is used to encrypt the password before it is stored in the DB
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    if err != nil {
        return "", err
    }

    return string(bytes), nil
}

// GenerateJWT creates a token container a userId and expires time
func GenerateJWT(userId string) (string, error) {
	_, tokenString, err := tokenAuth.Encode(map[string]interface{}{
		"userId": userId,
		"expires": time.Now().Add(time.Minute * 5).Unix(),
	})

	if err != nil {
		return "", err
	}
 	return tokenString, nil
}


func (rs AuthResource) Routes() chi.Router {
	r := chi.NewRouter()

	r.Post("/login", rs.Login)
	r.Post("/logout", rs.Logout)
	r.Post("/register", rs.Register)
	return r
}

func (rs AuthResource) Login(w http.ResponseWriter, r *http.Request) {
	var c Credentials
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	sr := config.Users.FindOne(context.TODO(), bson.M{"name": c.Username})
	if sr.Err() != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}
	var u models.User
	err := sr.Decode(&u)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(c.Password))
	if err != nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	fmt.Println("Successful login. Generating JWT")
	j, err := GenerateJWT(u.ID.Hex())
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	cookie := &http.Cookie{
		Name:	"jwt",
		Value:	j,
		MaxAge: 60 * 5,
		Path: "/",
	}
	http.SetCookie(w, cookie)
    w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct{
		Username string
		}{u.Name})
}

func (rs AuthResource) Logout(w http.ResponseWriter, r *http.Request) {
	c := &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Path:     "/",
		Expires: time.Unix(0, 0),
	
		HttpOnly: true,
	}
	
	http.SetCookie(w, c)
}

func (rs AuthResource) Register(w http.ResponseWriter, r *http.Request) {
	var c Credentials
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	sr := config.Users.FindOne(context.TODO(), bson.M{"name": c.Username})
	if sr.Err() == nil {
		http.Error(w, http.StatusText(http.StatusConflict), http.StatusConflict)
		return
	}

	h, err := HashPassword(c.Password)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	u := models.User{
		Name: c.Username,
		Password: h,
	}

	err = models.AddUser(u)
	if err != nil {
		fmt.Println(err)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}