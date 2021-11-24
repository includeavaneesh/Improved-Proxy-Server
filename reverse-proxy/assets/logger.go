package assets

import (
	"log"
	"os"
)

func LogFile(msg string) {
	file, err := os.OpenFile("AccessInfo.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	log.SetOutput(file)
	log.Print(msg)
}
