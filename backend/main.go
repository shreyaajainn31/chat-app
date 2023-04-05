package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Client struct {
	socket *websocket.Conn
	send   chan []byte
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

var hub = Hub{
	broadcast:  make(chan []byte),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Define the method to read messages from a client's socket connection
func (c *Client) readPump() {
	defer func() {
		hub.unregister <- c
		c.socket.Close()
	}()

	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			hub.unregister <- c
			c.socket.Close()
			break
		}
		message = append([]byte(c.socket.RemoteAddr().String()+": "), message...)
		hub.broadcast <- message
	}
}

// Define the method to write messages to a client's socket connection
func (c *Client) writePump() {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			c.socket.WriteMessage(websocket.TextMessage, message)
		}
	}
}

// define a struct to match the JSON object sent by the client
type PasswordMessage struct {
	Password string `json:"password"`
}

func handleWebSocketConnection(writer http.ResponseWriter, request *http.Request) {
	webSocketConnection, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// read the password from the PasswordMessage struct
	var passwordMessage PasswordMessage
	err = webSocketConnection.ReadJSON(&passwordMessage)
	if err != nil {
		log.Println(err)
		return
	}

	// check if the password is correct
	if passwordMessage.Password != "PASSWORD" {
		log.Println("Invalid password")
		response, _ := json.Marshal(map[string]bool{"success": false})
		webSocketConnection.WriteMessage(websocket.TextMessage, response)
		return
	}

	// send success message if password is correct
	response, _ := json.Marshal(map[string]bool{"success": true})
	webSocketConnection.WriteMessage(websocket.TextMessage, response)

	user := &Client{socket: webSocketConnection, send: make(chan []byte)}
	hub.register <- user

	go user.writePump()
	go user.readPump()
}

func main() {
	http.HandleFunc("/ws", handleWebSocketConnection)

	// will start the server now
	err := http.ListenAndServe(":3002", nil)
	if err != nil {
		log.Fatal("ListenAndServe", err)
	}
}
