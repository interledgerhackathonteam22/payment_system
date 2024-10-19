package main

import (
	"backend/internal/handlers"
	"log"
	"net/http"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/login", handlers.Index)

    err := http.ListenAndServe(":3000", mux)
    log.Println("Starting server on port 3000")
    if err != nil {
        log.Fatal(err)
    }
}