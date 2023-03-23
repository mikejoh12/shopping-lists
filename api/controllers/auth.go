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
	"github.com/lestrrat-go/jwx/v2/jwt"

	"github.com/mikejoh12/go-todo/config"
	"github.com/mikejoh12/go-todo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthResource struct{}

type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

var tokenAuth *jwtauth.JWTAuth

// Authenticator is a custom authentication middleware to enforce access from the
// Verifier middleware request context values. The Authenticator sends a 401 Unauthorized
// response for any unverified tokens and passes the good ones through. It adds json
// data to the response
func Authenticator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, _, err := jwtauth.FromContext(r.Context())

		if err != nil || token == nil || jwt.Validate(token) != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(struct {
				Error string `json:"error"`
			}{
				Error: "Unauthorized",
			})
			return
		}

		next.ServeHTTP(w, r)
	})
}

func init() {
	tokenAuth = jwtauth.New("HS256", []byte("secret-modify-this"), nil)
}

func (rs AuthResource) Routes() chi.Router {
	r := chi.NewRouter()

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(Authenticator)

		r.Post("/logout", rs.Logout)
	})

	// Public routes
	r.Group(func(r chi.Router) {
		r.Post("/login", rs.Login)
		r.Post("/register", rs.Register)
	})

	return r
}

// HashPassword is used to hash the password before it is stored in the DB
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

// GenerateJWT creates a token containing a userId and expiration time
func GenerateJWT(userId string) (string, error) {
	_, tokenString, err := tokenAuth.Encode(map[string]interface{}{
		"userId":  userId,
		"expires": time.Now().Add(time.Minute * 5).Unix(),
	})

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Login takes the credentials and returns a JWT token in a cookie
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

	j, err := GenerateJWT(u.ID.Hex())
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	cookie := &http.Cookie{
		Name:   "jwt",
		Value:  j,
		MaxAge: 60 * 5,
		Path:   "/",
	}
	http.SetCookie(w, cookie)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Username string `json:"username"`
	}{u.Name})
}

// Logout deletes the cookie containing the JWT
func (rs AuthResource) Logout(w http.ResponseWriter, r *http.Request) {
	c := &http.Cookie{
		Name:    "jwt",
		Value:   "",
		Path:    "/",
		Expires: time.Unix(0, 0),

		HttpOnly: true,
	}

	http.SetCookie(w, c)
}

// Register takes new user info in json and creates a new user
func (rs AuthResource) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var c Credentials
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	sr := config.Users.FindOne(context.TODO(), bson.M{"name": c.Username})
	if sr.Err() == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(struct {
			Error string `json:"message"`
		}{"Username already in use"})
		return
	}

	h, err := HashPassword(c.Password)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	u := models.User{
		ID:       primitive.NewObjectID(),
		Name:     c.Username,
		Password: h,
	}

	err = models.AddUser(u)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
