package assets

import (
	"net/http"
	"strings"
)

func BlockOS(r *http.Request) bool {
	ua := r.Header.Get("User-Agent")

	if strings.Index(ua, "Windows") > 0 {
		return true
	} else if strings.Index(ua, "Linux") > 0 {
		return true
	} else {
		return false
	}

}
