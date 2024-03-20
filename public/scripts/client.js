
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const animSpeed = 250;

$(() => {

  $(window).on("scroll", function() {
    if($(this).scrollTop() > 200) {
      $('.scroll-top').fadeIn(animSpeed).css('display', 'grid');
    } else {
      $('.scroll-top').fadeOut(animSpeed);
    }
  });

  $('.scroll-top').on('click', function() {
    $('html, body').animate({scrollTop: 0}, animSpeed);
    if($('.new-tweet').is(':hidden')) {
      $('.new-tweet').slideDown(animSpeed, function() {
        $('.new-tweet__inputtext').focus();
      });
    } else {
      $('.new-tweet__inputtext').focus();
    }
  });


  loadTweets();
  $('.new-tweet form').submit(postTweet);
  // tweet on enter key in text area
  $('#tweet-text').on('keyup', function(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      $('.new-tweet form').submit();
    }
  });

  $('.header-nav__sub').on('click', function() {
    if($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp(animSpeed);
    } else {
      $('.new-tweet').slideDown(animSpeed, function() {
        $('.new-tweet__inputtext').focus();
      });
    }

  });
});



const postTweet = function(event) {
  event.preventDefault();
  hideErrorMessage();

  const tweetElement = $(this).children('.new-tweet__inputtext');
  if(tweetElement.length === 0) {
    showErrorMessage('No tweet text element found! Please refresh the page');
    return;
  }
  const tweetText = tweetElement.val().trim();

  if(tweetText.length === 0) {
    showErrorMessage('No tweet text entered!');
    return;
  }

  if(tweetText.length > 140) {
    showErrorMessage('Tweet exceededs character limit!');
    return;
  }

  const tweetParams = $(this).serialize();

  $.post('/tweets', tweetParams)
    .done((data) => {
      $('.new-tweet__inputtext').val('');
      $('.new-tweet__counter').text('140');
      loadTweets();
    })
    .fail((jqXHR, status, err) => {
      showErrorMessage(`Error posting tweet: <strong>${status}</strong><p>${err}</p>`);
    });
}

let errorTimeout;
const showErrorMessage = (message) => {
  const $error = $('.error');
  $error.text(message);
  $error.fadeIn(animSpeed);

  if(errorTimeout) {
    clearTimeout(errorTimeout);
  }
  errorTimeout = setTimeout(() => {
    $error.fadeOut(animSpeed);
  },3000);
};

const hideErrorMessage = () => {
  if(errorTimeout) {
    clearTimeout(errorTimeout);
  }
  $('.error').fadeOut(animSpeed);
}


const loadTweets = () => {
  $.getJSON('/tweets')
    .done((data) => {
      clearTweets();
      data.sort((a, b) => b.created_at - a.created_at);
      renderTweets(data);
    })
    .fail((jqXHR, status, err) => {
      showErrorMessage(`Error loading tweets: <strong>${status}</strong><p>${err}</p>`);
    });
};

const clearTweets = () => {
  $('.tweet-container').empty();
};

const renderTweets = (tweets) => {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweet-container').append($tweet)

  }
};


const createTweetElement = (tweet) => {

  // if empty tweet, return
  if(!tweet || !tweet.content || !tweet.content.text || !tweet.user || !tweet.user.name || !tweet.user.handle || !tweet.created_at) {
    return false;
  };

  const whenDate = new Date(tweet.created_at);
  let whenString = sanitize(tweet.created_at);

  // if valid date, generate timeago string or locale string if timeago is not defined
  if(whenDate instanceof Date && !isNaN(whenDate)) {
    whenString = timeagoFail ?  whenDate.toLocaleString() : timeago.format(whenDate);
  }



  return $(`
  <article class="tweet">
        <header>
          <div class="tweet__profile">
            <img src="${sanitize(tweet.user.avatars)}" alt="author avatar"/>
            <div>${sanitize(tweet.user.name)}</div>
          </div>
          <div class="tweet__handle">${sanitize(tweet.user.handle)}</div>
        </header>
        <div class="tweet__tweet">
          <p>${sanitize(tweet.content.text)}</p>
        </div>
        <footer>
          <time class="tweet__age" datetime="${whenDate}">${whenString}</time>
          <div class="tweet__actions">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart">
              <span class="count">1</span>
            </i>
          </div>
        </footer>
        </div>
      </article>`);
};
