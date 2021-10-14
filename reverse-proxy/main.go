package main

import (
	"flag"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	
)

var (
	PROXY_PORT = 60                      //Reverse proxy access port #
	SERVER_URL = "http://localhost:8000" // Actual server URL
)

type Handler struct {
	proxy *httputil.ReverseProxy
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.proxy.ServeHTTP(w, r)
	fmt.Println("--------------------------------\nServing HTTP initiated")
}

func ReverseProxyHandler() {

	url, err := url.Parse(SERVER_URL)
	if err != nil {
		panic(err)
	}

	port := flag.Int("p", PROXY_PORT, "port")
	flag.Parse()

	director := func(req *http.Request) {
		req.URL.Scheme = url.Scheme
		req.URL.Host = url.Host
	}

	fmt.Println("Host:", url)
	fmt.Println("Port:", "http://localhost:"+ )
	reverseProxy := &httputil.ReverseProxy{Director: director}
	handler := Handler{proxy: reverseProxy}
	http.Handle("/", handler)

	fmt.Println("Reverse proxy initialized at port: ", *port)

	if *port != 60 {
		err := "Cannot access the server, please try again later"
		fmt.Println(err)
		return
	}

	http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)

}

func main() {
	ReverseProxyHandler()
}
