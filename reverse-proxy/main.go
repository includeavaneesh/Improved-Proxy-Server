package main

import (
	"flag"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"

	"./assets"
)

var (
	PROXY_PORT = 60                      //Reverse proxy access port #
	SERVER_URL = "http://localhost:8000" // Actual server URL
)

type Handler struct {
	proxy *httputil.ReverseProxy
}

func ResponseStatusHandler() {
	res, err := http.Get(SERVER_URL)

	if err != nil {
		panic(err)
	}

	fmt.Printf("HTTP Response Status: %d\n", res.StatusCode)
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	remoteIP := assets.GetIP(r)

	if assets.BlacklistIPCheckHandler(remoteIP) {

		h.proxy.ServeHTTP(w, r)
		fmt.Println("\n---------------------------------------------------------\nServing HTTP initiated")
		ResponseStatusHandler()
		fmt.Println("\nDirecting user `" + remoteIP + "` to sever...")
		// fmt.Println(statusCode)

	} else {
		// hijacker
		fmt.Println("\n------------------ Error Details ------------------------\n")
		fmt.Println(">> Denied access to IP: " + remoteIP + "\n\n")
		assets.ConnectionHijacker(w, r)
		fmt.Println("\n---------------------------------------------------------")
	}

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

	fmt.Println("✓ Host:", url)
	reverseProxy := &httputil.ReverseProxy{Director: director}
	handler := Handler{proxy: reverseProxy}
	http.Handle("/", handler)

	fmt.Println("✓ Reverse proxy initialized at port: ", *port)

	if *port != 60 {
		err := "Cannot access the server, please try again later"
		fmt.Println(err)
		return
	}

	http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)

}

func main() {
	assets.MongoInitiator()
	ReverseProxyHandler()

}
