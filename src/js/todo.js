//추가버튼 클릭시//
var cnt = 0;


//함수선언식
var addTodo = function () {
  //변수에 인풋담고 뒤에 밸류가져오기//
  var id = "remove" + cnt;
  var value = $('#todoInput').val();
  if (value.trim().length >= 1) {
    //추가할 엘리먼트를 스트링화 하고 값(value) 추가
    var item = '<li class="todo__item"><div class="todo__item-title">' + value + '</div><button id="' + id + '"class="todo__item-remove">X</button></li>';
    //변수에 담긴 엘리먼트를 todo__list에 뒤로 추가
    $(".todo__list").append(item)

    //클릭시 해당되는것(this)에서 부모삭제//
    $("#" + id).click(function () {
      $(this).parent(".todo__item").remove()
    })

    //추가가 끝나면 input value 초기화//
    $(".todo__input").val("")
    cnt++;
  }
}

$(".add").click(function () {
  addTodo()
});

$("#todoInput").keydown(function (event) {
  if (event.keyCode == 13) {
    addTodo()
  }
})