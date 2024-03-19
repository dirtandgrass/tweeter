const sanitize = (content) => {
  return $(`<i>${content}</i>`).text();
}