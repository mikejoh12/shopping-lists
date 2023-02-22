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
	Owner		 primitive.ObjectID `bson:"ownerId"`
}

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
	Password	 string				`json:"password"`
}

func AllTodos(objId primitive.ObjectID) ([]Todo, error) {
	cursor, err := config.Todos.Find(context.TODO(), bson.M{"ownerId": objId})
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

func AddTodo(t Todo) error {
	_, err := config.Todos.InsertOne(context.TODO(), t)
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

func AddUser(u User) error {
	_, err := config.Users.InsertOne(context.TODO(), u)
	if err != nil {
		return err
	}
	return nil
}
