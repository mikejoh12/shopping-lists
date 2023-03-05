package main

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mikejoh12/go-todo/controllers"
)

// Embeds the React static bundle into the Go binary
//go:embed dist
var staticFS embed.FS

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	FileServer(r, "/", getFileSystem(staticFS))

	r.Mount("/api/auth", controllers.AuthResource{}.Routes())
	r.Mount("/api/lists", controllers.ShoppingListsResource{}.Routes())

	http.ListenAndServe(":8080", r)
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
	fsys, err := fs.Sub(embedFS, "dist")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}