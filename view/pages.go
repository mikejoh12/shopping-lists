package view

import (
	"net/http"

	"github.com/mikejoh12/go-todo/models"
)

func Login(w http.ResponseWriter, r *http.Request) {
	TPL.ExecuteTemplate(w, "login.gohtml", nil)
}

func Register(w http.ResponseWriter, r *http.Request) {
	TPL.ExecuteTemplate(w, "register.gohtml", nil)
}

func TodosView(w http.ResponseWriter, r *http.Request) {
	todos, err := models.AllTodos()
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	TPL.ExecuteTemplate(w, "todos.gohtml", todos)
}