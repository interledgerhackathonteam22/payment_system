package handlers

import (
    "io"
    "log"
    "net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {
    res := "Hello World"
    _, err := io.WriteString(w, res)
    if err != nil {
        log.Println("Error writing response:", err)
        http.Error(w, "Failed to write response", http.StatusInternalServerError)
        return
    }
}