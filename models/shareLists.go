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
		{
			{Key: "$match", Value: bson.M{"sharingInviteIds": userId}},
		},
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "users",
				"localField":   "ownerId",
				"foreignField": "_id",
				"as":           "owner",
			}},
		},
		{
			{Key: "$addFields", Value: bson.M{
				"ownerName": bson.M{"$arrayElemAt": []interface{}{"$owner.name", 0}},
			}},
		},
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "users",
				"localField":   "sharingIds",
				"foreignField": "_id",
				"as":           "sharings",
			}},
		},
		{
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

func AddShareInvite(ownerId, listId, userId primitive.ObjectID) (bool, error) {

	update := bson.M{
		"$addToSet": bson.M{
			"sharingInviteIds": userId,
		},
	}
	result, err := config.ShoppingLists.UpdateOne(context.TODO(), bson.M{"ownerId": ownerId, "_id": listId}, update)

	if err != nil || result.ModifiedCount != 1 {
		return false, err
	}
	return true, nil
}
