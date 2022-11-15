package serializer

import (
	"fmt"
	"testing"
)

type person struct {
	Name string
	Age  int
}

func TestGobRedisSerializer(t *testing.T) {
	var serializer RedisSerializer[person] = GobRedisSerializer[person]{}

	var p = person{Name: "arthur ming", Age: 18}

	data, err := serializer.Serialize(p)
	if err != nil {
		t.Error(err.Error())
	}
	if len(data) > 0 {
		t.Log(data)
	}

	p2, err := serializer.Deserialize(data)
	if err != nil {
		t.Error(err.Error())
	}

	t.Log(p2.Name)
	t.Log(p2.Age)

	var p3 = p2
	t.Log(p3.Name)
	t.Log(p3.Age)

	fmt.Println(p2)
	fmt.Println(p3)
}
