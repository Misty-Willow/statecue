package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Misty-Willow/statecue/apps/api/internal/statecue"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: statecue.NewHandler(),
	}

	log.Printf("statecue-api listening on :%s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
