package view

import "html/template"

var TPL *template.Template

func init() {
	TPL = template.Must(template.ParseGlob("view/templates/*.gohtml"))
}