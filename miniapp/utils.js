export function getHDAvatarUrl(avatarUrl) {
  const parts = avatarUrl.split('/');

  if (parts[parts.length - 1] && (parts[parts.length - 1] == 46 || parts[parts.length - 1] == 64 || parts[parts.length - 1] == 96 || parts[parts.length - 1] == 132)) {
    parts[parts.length - 1] = 0;
  }

  return parts.join('/');
}

// Thanks to: https://www.jianshu.com/p/8a4f62cc7f8d
export function promisify(api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
}

// start from 1
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}
