package models

import (
	"context"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name     string             `json:"name"`
	Password string             `json:"password"`
}

func AddUser(u User) error {
	_, err := config.Users.InsertOne(context.TODO(), u)
	if err != nil {
		return err
	}

	return nil
}
