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
	IsCompleted	 bool				`json:"isCompleted"`
}

type ShoppingList struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	OwnerId		 primitive.ObjectID `bson:"ownerId"`
	Name		 string				`json:"name" bson:"name"`
	Items		 []ListItem			`json:"items" bson:"items"`
}

type User struct {
	ID            primitive.ObjectID 	`json:"id" bson:"_id,omitempty"`
	Name   		  string				`json:"name"`
	Password	  string				`json:"password"`
}


func AllShoppingLists(userId primitive.ObjectID) (*[]ShoppingList, error) {
	cursor, err := config.ShoppingLists.Find(context.TODO(), bson.M{"ownerId": userId})
	if err != nil {			
		return nil, err	
	}
	var results []ShoppingList

	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	for _, result := range results {
		cursor.Decode(&result)
	}

	return &results, nil
}

func AddListItem(name string, userId, listId primitive.ObjectID) error {
	li := ListItem{
		ID: primitive.NewObjectID(),
		Name: name,
		IsCompleted: false,
	}

	update := bson.M{
		"$push": bson.M{
			"items": li,
		},
	}
	_, err := config.ShoppingLists.UpdateOne(context.TODO(), bson.M{"ownerId": userId, "_id": listId}, update)

	if err != nil {
		return err
	}
	return nil
}

func ModifyListItem(userId primitive.ObjectID, li ListItem) error {


	update := bson.M{
		"$set": bson.M{
			"items.$": li,
		},
	}

	_, err := config.ShoppingLists.UpdateOne(context.TODO(), bson.M{"ownerId": userId, "items._id": li.ID}, update)
	if err != nil {
		return err
	}
	return nil
}

func AddShoppingList(name string, ownerId primitive.ObjectID) (string, error) {
	t := ShoppingList{
		ID: primitive.NewObjectID(),
		OwnerId: ownerId,
		Name: name,
		Items: make([]ListItem, 0),
	}
	_, err := config.ShoppingLists.InsertOne(context.TODO(), t)
	if err != nil {
		return "", err
	}
	return t.ID.Hex(), nil
}

func RemoveListItem(itemId string, ownerId primitive.ObjectID) error {
	objId, err := primitive.ObjectIDFromHex(itemId)
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

func RemoveList(listId string, ownerId primitive.ObjectID) error {
	listObjId, err := primitive.ObjectIDFromHex(listId)
	if err != nil {
		return err
	}

	_, err = config.ShoppingLists.DeleteOne(context.TODO(), bson.M{
		"_id": listObjId,
		"ownerId": ownerId,
	})
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
