const hoverEl = document.getElementById('totalUsers');
const popup = document.getElementById('UsersPopup');
const totalUsersModal = new bootstrap.Modal(document.getElementById('totalUsersModal'));
const copiedToClip = document.getElementById("copiedToClip");

hoverEl.addEventListener("mouseover", function(e) {
  popup.style.display = 'block';
});

hoverEl.addEventListener("mouseout", function(e) {
  popup.style.display = 'none';
});

function fadeOutEffect() {
  const fadeTarget = copiedToClip;
  let fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 50);
}

function copyUserAddresses() {
  userAddresses.select();
  userAddresses.setSelectionRange(0, 999999);
  navigator.clipboard.writeText(userAddresses.value);

  copiedToClip.style.display = 'flex';
  copiedToClip.style.opacity = 1;
  setTimeout(function(){
    fadeOutEffect();
  },1000);
}