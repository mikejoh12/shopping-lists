package config

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var DB *mongo.Database
var ShoppingLists, Users *mongo.Collection

const uri = "mongodb://localhost"

func init() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected and pinged.")

	DB = client.Database("go-todo")
	ShoppingLists = client.Database("go-todo").Collection("shoppingLists")
	Users = client.Database("go-todo").Collection("users")
}

