package assets

import (
	"fmt"
	"net/http"
)

func ConnectionHijacker(w http.ResponseWriter, r *http.Request) {
	if h, ok := w.(http.Hijacker); ok {
		c, _, err := h.Hijack()
		if err != nil {
			c.Close()
			return
		}
	}
	// fallback to error response
	fmt.Printf(">> Error: ")
	http.Error(w, "forbidden", http.StatusForbidden)

	// return
}

func GetIP(r *http.Request) string {
	forwarded := r.Header.Get("X-FORWARDED-FOR")
	if forwarded != "" {
		return forwarded
	}
	return r.RemoteAddr
}

func IPError() {
	fmt.Println("Client's IP has been blacklisted from accessing the server")
}
