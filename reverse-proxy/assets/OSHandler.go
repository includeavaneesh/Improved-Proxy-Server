package assets

import (
	"net/http"
	"strings"
	"fmt"
)

func BlockOS(r *http.Request) bool {
	ua := r.Header.Get("User-Agent")

	if strings.Index(ua, "Macintosh") > 0 {
		return true
	} else if strings.Index(ua, "Linux") > 0 {
		return true
	} else {
		return false
	}

}

func OSError() {
	fmt.Println("Your OS is not supported by the server.")
}

