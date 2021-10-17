package main

import (
	"flag"
	"fmt"
	"net/http"
)

func main() {

	// TEST SERVER
	var port = flag.Int("p", 8000, "port")
	flag.Parse()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(fmt.Sprintf("hello on port %d", *port)))
	})
	err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)
	fmt.Print(err)
}
