package models

import (
	"context"
	"fmt"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ListItem struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name"`
	IsCompleted bool               `json:"isCompleted" bson:"isCompleted"`
}

type ShoppingList struct {
	ID               primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	OwnerId          primitive.ObjectID   `json:"ownerId" bson:"ownerId"`
	OwnerName        string               `json:"ownerName" bson:"ownerName"`
	Name             string               `json:"name" bson:"name"`
	Items            []ListItem           `json:"items" bson:"items"`
	SharingIds       []primitive.ObjectID `json:"sharingIds" bson:"sharingIds"`
	SharingInviteIds []primitive.ObjectID `json:"sharingInviteIds" bson:"sharingInviteIds"`
	SharingNames     []string             `json:"sharingNames" bson:"sharingNames"`
}

type User struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name     string             `json:"name"`
	Password string             `json:"password"`
}

func AllShoppingLists(userId primitive.ObjectID) (*[]ShoppingList, error) {

	pipeline := mongo.Pipeline{
		{ // Match the shopping lists where the specified user is either the owner or one of the sharers
			{Key: "$match", Value: bson.M{
				"$or": []interface{}{
					bson.M{"ownerId": userId},
					bson.M{"sharingIds": userId},
				},
			}},
		},
		{ // Lookup the owner user by ID and add their name to the shopping list document
			{Key: "$lookup", Value: bson.M{
				"from":         "users",
				"localField":   "ownerId",
				"foreignField": "_id",
				"as":           "owner",
			}},
		},
		{ // Add a new field "ownerName" to the shopping list document with the owner's name
			{Key: "$addFields", Value: bson.M{
				"ownerName": bson.M{"$arrayElemAt": []interface{}{"$owner.name", 0}},
			}},
		},
		{ // Lookup the sharing users by ID and add their names to the shopping list document
			{Key: "$lookup", Value: bson.M{
				"from":         "users",
				"localField":   "sharingIds",
				"foreignField": "_id",
				"as":           "sharings",
			}},
		},
		{ // Add a new field "sharingNames" to the shopping list document with the sharing users' names
			{Key: "$addFields", Value: bson.M{
				"sharingNames": "$sharings.name",
			}},
		},
	}

	var result []ShoppingList
	cursor, err := config.ShoppingLists.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	if err = cursor.All(context.Background(), &result); err != nil {
		return nil, err
	}

	return &result, nil
}

func AddListItem(name string, userId, listId primitive.ObjectID) error {
	li := ListItem{
		ID:          primitive.NewObjectID(),
		Name:        name,
		IsCompleted: false,
	}

	filter := bson.M{
		"_id": listId,
		"$or": bson.A{
			bson.M{"ownerId": userId},
			bson.M{"sharingIds": userId},
		},
	}

	update := bson.M{
		"$push": bson.M{
			"items": li,
		},
	}
	_, err := config.ShoppingLists.UpdateOne(context.TODO(), filter, update)

	if err != nil {
		return err
	}
	return nil
}

func ModifyListItem(userId primitive.ObjectID, li ListItem) error {
	filter := bson.M{
		"items._id": li.ID,
		"$or": bson.A{
			bson.M{"ownerId": userId},
			bson.M{"sharingIds": userId},
		},
	}

	update := bson.M{
		"$set": bson.M{
			"items.$": li,
		},
	}

	_, err := config.ShoppingLists.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return nil
}

func AddNewShoppingList(name string, ownerId primitive.ObjectID) (string, error) {
	t := ShoppingList{
		ID:               primitive.NewObjectID(),
		OwnerId:          ownerId,
		Name:             name,
		Items:            make([]ListItem, 0),
		SharingIds:       make([]primitive.ObjectID, 0),
		SharingInviteIds: make([]primitive.ObjectID, 0),
	}
	_, err := config.ShoppingLists.InsertOne(context.TODO(), t)
	if err != nil {
		return "", err
	}
	return t.ID.Hex(), nil
}

func AddShoppingLists(sl []ShoppingList, ownerId primitive.ObjectID) error {
	slInterface := make([]interface{}, len(sl))
	for i := range sl {
		slInterface[i] = sl[i]
	}

	_, err := config.ShoppingLists.InsertMany(context.TODO(), slInterface)
	if err != nil {
		return err
	}
	return nil
}

func CheckoutList(listId primitive.ObjectID) error {
	filter := bson.M{"_id": listId}

	update := bson.M{
		"$pull": bson.M{
			"items": bson.M{
				"isCompleted": true,
			},
		},
	}

	updatedResult, err := config.ShoppingLists.UpdateOne(context.TODO(), filter, update)
	fmt.Println("Update result", updatedResult.ModifiedCount)
	if err != nil {
		return err
	}

	return nil
}

func RemoveListItem(itemId string, userId primitive.ObjectID) error {
	objId, err := primitive.ObjectIDFromHex(itemId)
	if err != nil {
		return err
	}

	filter := bson.M{
		"$or": bson.A{
			bson.M{"ownerId": userId},
			bson.M{"sharingIds": userId},
		},
	}

	update := bson.M{
		"$pull": bson.M{
			"items": bson.M{
				"_id": objId,
			},
		},
	}

	_, err = config.ShoppingLists.UpdateMany(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return nil
}

func RemoveList(listId string, ownerId primitive.ObjectID) (success bool, err error) {
	listObjId, err := primitive.ObjectIDFromHex(listId)
	if err != nil {
		return false, err
	}

	dr, err := config.ShoppingLists.DeleteOne(context.TODO(), bson.M{
		"_id":     listObjId,
		"ownerId": ownerId,
	})

	if err != nil {
		return false, err
	} else if dr.DeletedCount == 0 {
		return false, nil
	}

	return true, nil
}

func AddUser(u User) error {
	_, err := config.Users.InsertOne(context.TODO(), u)
	if err != nil {
		return err
	}

	return nil
}
