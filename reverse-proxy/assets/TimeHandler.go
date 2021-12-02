package assets

import (
	"fmt"
	"time"
)

func BlockTime() bool {
	current := time.Now()
	currentTime := current.Format("15:04:05")
	time1 := "10:00:00"
	time2 := "11:00:00"
	if currentTime >= time1 && currentTime <= time2 {
		return false
	}
	return true
}

func TimeError() {
	time1 := "10:00:00"
	time2 := "11:00:00"
	fmt.Println("Access of clients are blocked from " + time1 + " to " + time2)
}
