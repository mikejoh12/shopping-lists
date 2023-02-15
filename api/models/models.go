package models

import (
	"context"
	"fmt"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Todo struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
}

func AllTodos() ([]Todo, error) {
	cursor, err := config.Todos.Find(context.TODO(), bson.M{})
	if err != nil {
		return nil, err
	}
	var results []Todo
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	fmt.Println("todo slice", results)
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

func RemoveTodo(id string) error {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = config.Todos.DeleteOne(context.TODO(), bson.M{"_id": objId})
	if err != nil {
		return err
	}
	return nil
}
