package statecue

import (
	"encoding/json"
	"net/http"
	"strings"
)

type healthResponse struct {
	OK       bool   `json:"ok"`
	Service  string `json:"service"`
	DataMode string `json:"dataMode"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func NewHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", handleHealth)
	mux.HandleFunc("/api/cue", handleCue)
	mux.HandleFunc("/api/scenarios", handleScenarios)

	return withJSONHeaders(mux)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}

	writeJSON(w, http.StatusOK, healthResponse{
		OK:       true,
		Service:  "statecue-api",
		DataMode: "mock",
	})
}

func handleCue(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}

	scenario := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("scenario")))
	if scenario == "" {
		writeJSON(w, http.StatusOK, TodayCue())
		return
	}

	for _, cue := range Scenarios() {
		if string(cue.Direction) == scenario {
			writeJSON(w, http.StatusOK, cue)
			return
		}
	}

	writeJSON(w, http.StatusBadRequest, errorResponse{Error: "scenario must be one of go, light, rest, or check"})
}

func handleScenarios(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}

	writeJSON(w, http.StatusOK, Scenarios())
}

func allowMethod(w http.ResponseWriter, r *http.Request, method string) bool {
	if r.Method == method {
		return true
	}

	w.Header().Set("Allow", method)
	writeJSON(w, http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
	return false
}

func withJSONHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Vary", "Origin")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
