package models

import (
	"context"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


type ListItem struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
}

type ShoppingList struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	OwnerId		 primitive.ObjectID `bson:"ownerId"`
	Name		 string				`json:"name" bson:"name"`
	Items		 []ListItem			`json:"items" bson:"items"`
}

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name   		 string				`json:"name"`
	Password	 string				`json:"password"`
}


func AllShoppingLists(userId primitive.ObjectID) (*ShoppingList, error) {
	cursor := config.ShoppingLists.FindOne(context.TODO(), bson.M{"ownerId": userId})
	results := ShoppingList{}
	if err := cursor.Decode(&results); err != nil {
		return nil, err
	}
	return &results, nil
}

func AddListItem(t ListItem, userId primitive.ObjectID) error {
	t.ID = primitive.NewObjectID()

	update := bson.M{
		"$push": bson.M{
			"items": t,
		},
	}
	_, err := config.ShoppingLists.UpdateOne(context.TODO(), bson.M{"ownerId": userId}, update)

	if err != nil {
		return err
	}
	return nil
}

func AddShoppingList(name string, ownerId primitive.ObjectID) error {
	t := ShoppingList{
		ID: primitive.NewObjectID(),
		OwnerId: ownerId,
		Name: name,
		Items: make([]ListItem, 0),
	}
	_, err := config.ShoppingLists.InsertOne(context.TODO(), t)
	if err != nil {
		return err
	}
	return nil
}

func RemoveTodo(todoId string, ownerId primitive.ObjectID) error {
	objId, err := primitive.ObjectIDFromHex(todoId)
	if err != nil {
		return err
	}

	update := bson.M{
		"$pull": bson.M{
			"items": bson.M{
				"_id": objId,
			},
		},
	}

	_, err = config.ShoppingLists.UpdateMany(context.TODO(), bson.M{"ownerId": ownerId}, update)
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

	err = AddShoppingList(u.Name, u.ID)
	if err != nil {
		return err
	}

	return nil
}
