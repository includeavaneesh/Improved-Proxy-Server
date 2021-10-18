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

	http.Handle("/", http.FileServer(http.Dir("./static")))
	err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)
	
	fmt.Print(err)
}
