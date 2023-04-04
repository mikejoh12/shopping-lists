package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mikejoh12/go-todo/controllers"
)

// Embeds the React static bundle into the Go binary
//
//go:embed static-ui
var staticFS embed.FS

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	FileServer(r, "/", getFileSystem(staticFS))

	r.Get("/api", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Api is up and running!")
	})

	r.Mount("/api/auth", controllers.AuthResource{}.Routes())
	r.Mount("/api/lists", controllers.ShoppingListsResource{}.Routes())

	port := os.Getenv("PORT")
	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}

func getFileSystem(embedFS embed.FS) http.FileSystem {

	// Get the build subdirectory as the
	// root directory so that it can be passed
	// to the http.FileServer
	fsys, err := fs.Sub(embedFS, "static-ui")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}
