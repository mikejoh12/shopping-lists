package models

import (
	"context"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
)

type Todo struct {
	Name   			string
}

func AllTodos() ([]Todo, error) {
	cursor, err := config.Todos.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	var results []Todo
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

func AddTodo(name string) error {
	newTodo := Todo{Name: name}
	_, err := config.Todos.InsertOne(context.TODO(), newTodo)
	if err != nil {
		return err
	}
	return nil
} 
