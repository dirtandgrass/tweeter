

$(() => {

  $('#tweet-text').on('input', function() {
    const maxChars = 140;
    $(this).val(sanitize($(this).val()));

    const currentChars = $(this).val().length;
    const remainingChars = maxChars - currentChars;
    const counter = $(this).siblings('.new-tweet__submission').children('.new-tweet__counter');
    counter.text(remainingChars);
    if (remainingChars < 0) {
      counter.addClass('error');
    } else {
      counter.removeClass('error');
    }
  });
});
