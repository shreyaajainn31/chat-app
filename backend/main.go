package main

import (
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
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
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

func handleWebSocketConnection(writer http.ResponseWriter, request *http.Request) {
	webSocketConnection, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// We will get the password from the user and check if it is valid or not
	// In order it to be valid then password should not be empty
	// Password should be equal to your password

	var passwordFromUser string
	err = webSocketConnection.ReadJSON(&passwordFromUser)
	if err != nil {
		log.Println(err)
		return
	}

	// For now I have kept password as "PASSWORD" but it can be later changed to anything else
	// If the password is not equal to that then invalid password error will be displayed
	if passwordFromUser != "PASSWORD" {
		log.Println("Invalid password")
		return
	}

	//If we have the correct password then we need to register the user
	// to access the chat room

	user := &Client{socket: webSocketConnection, send: make(chan []byte)}
	hub.register <- user

	go user.writePump()
	go user.readPump()
}
func main() {
	http.HandleFunc("/ws", handleWebSocketConnection)

	// will start the server now
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe", err)
	}
}
