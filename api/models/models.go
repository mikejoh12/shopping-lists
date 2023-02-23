package models

import (
	"context"
	"fmt"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)


type TodoItem struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
}

type TodoList struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name		 string				`json:"name" bson:"name"`
	Items		 []TodoItem			`json:"items" bson:"items"`
}

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
	Password	 string				`json:"password"`
	TodoLists	 []TodoList			`json:"todolists" bson:"todolists"`
}

type TodoResponse struct {
	Todolists	[]TodoList			`json:"todolists" bson:"todolists"`
}

func AllTodos(userId primitive.ObjectID) (*TodoResponse, error) {
	opts := options.FindOne().SetProjection(bson.D{{Key:"_id", Value: 0}, {Key: "todolists", Value: 1}})
	cursor := config.Users.FindOne(context.TODO(), bson.M{"_id": userId}, opts)
	results := TodoResponse{}
	if err := cursor.Decode(&results); err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("todo slice", results)
	return &results, nil
}

func AddTodo(t TodoItem, userId primitive.ObjectID) error {
	t.ID = primitive.NewObjectID()
	arrayFilters := options.ArrayFilters{
		Filters: bson.A{bson.M{"x.name": "Grocery"}},
	}
	updateOpts := options.UpdateOptions{
		ArrayFilters: &arrayFilters,
	}
	update := bson.M{
		"$push": bson.M{
			"todolists.$[x].items": t,
		},
	}
	_, err := config.Users.UpdateOne(context.TODO(), bson.M{"_id": userId}, update, &updateOpts)

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
