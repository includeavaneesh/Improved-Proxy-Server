package assets

// contains MONGODB based functions

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type IP struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	IP string             `json:"ip,omitempty" bson:"ip,omitempty"`
}

var (
	Client               *mongo.Client
	CONNECTION_URL       = "mongodb://localhost:27017"
	DATABASE             = "reverse-proxy"
	COLLECTION_BLACKLIST = "blacklist"
	COLLECTION_WHITELIST = "whitelist"
)

func GetBlacklistClient(Client *mongo.Client) *mongo.Collection {
	connection := Client.Database(DATABASE).Collection(COLLECTION_BLACKLIST)
	return connection
}

func GetWhitelistClient(Client *mongo.Client) *mongo.Collection {
	connection := Client.Database(DATABASE).Collection(COLLECTION_WHITELIST)
	return connection
}

func BlacklistIPCheckHandler(ip string) bool {
	collection := GetBlacklistClient(Client)
	var check_ip IP
	err := collection.FindOne(context.TODO(), bson.D{{"ip", ip}}).Decode(&check_ip)

	return err == mongo.ErrNoDocuments

}

func MongoInitiator() {
	Client, _ = mongo.NewClient(options.Client().ApplyURI(CONNECTION_URL))
	ctx, _ := context.WithTimeout(context.Background(), 1*time.Second)
	err := Client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("MongoDb Connection Initialized...")
}
