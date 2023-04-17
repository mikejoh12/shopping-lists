package models

import (
	"context"

	"github.com/mikejoh12/go-todo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserIdByName(userName string) (primitive.ObjectID, error) {
	sr := config.Users.FindOne(context.TODO(), bson.M{"name": userName})
	var u User
	err := sr.Decode(&u)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return u.ID, nil
}

func AllShareInviteShoppingLists(userId primitive.ObjectID) (*[]ShoppingList, error) {
	pipeline := mongo.Pipeline{
		{ // Match the shopping lists where the specified user is either the owner or one of the sharers
			{Key: "$match", Value: bson.M{"sharingInviteIds": userId}},
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

	/*
		cursor, err := config.ShoppingLists.Find(context.TODO(), bson.M{"sharingInviteIds": userId})
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
	*/
}

func ShareListWithUser(listId, userId primitive.ObjectID) (bool, error) {
	filter := bson.M{"_id": listId, "sharingInviteIds": userId}
	update := bson.M{
		"$addToSet": bson.M{
			"sharingIds": userId,
		},
		"$pull": bson.M{
			"sharingInviteIds": userId,
		},
	}
	result, err := config.ShoppingLists.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return false, err
	}
	if result.ModifiedCount == 0 {
		return false, nil
	}
	return true, nil
}

func DeclineShareListWithUser(listId, userId primitive.ObjectID) (bool, error) {
	filter := bson.M{"_id": listId, "sharingInviteIds": userId}
	update := bson.M{
		"$pull": bson.M{
			"sharingInviteIds": userId,
		},
	}
	result, err := config.ShoppingLists.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return false, err
	}
	if result.ModifiedCount == 0 {
		return false, nil
	}
	return true, nil
}

func AddShareInvite(ownerId, listId, userId primitive.ObjectID) error {

	update := bson.M{
		"$addToSet": bson.M{
			"sharingInviteIds": userId,
		},
	}
	_, err := config.ShoppingLists.UpdateOne(context.TODO(), bson.M{"ownerId": ownerId, "_id": listId}, update)

	if err != nil {
		return err
	}
	return nil
}
