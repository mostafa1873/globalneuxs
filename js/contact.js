// نموذج التواصل - إرسال عبر mailto
const form = document.getElementById('contactForm');
if(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent('رسالة من موقع Global Nexus');
    const body = encodeURIComponent(`الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\n${message}`);
    window.location.href = `mailto:globalnexus1999@gmail.com?subject=${subject}&body=${body}`;
    document.getElementById('contactSuccess').style.display = 'block';
    form.reset();
    setTimeout(()=>{
      document.getElementById('contactSuccess').style.display = 'none';
    }, 4000);
  });
}