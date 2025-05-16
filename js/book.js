document.addEventListener('DOMContentLoaded', function() {
    console.log('Book animation initializing...');
    
    // 预加载图片
    const imgLoader = document.querySelector('.imgLoader');
    if (imgLoader) {
        console.log('Image loader found, starting preload...');
        setTimeout(() => {
            imgLoader.style.display = 'none';
            console.log('Image preload complete');
        }, 1000);
    } else {
        console.warn('Image loader element not found');
    }

    // 添加翻页动画
    const flips = document.querySelectorAll('.flip');
    if (flips.length > 0) {
        console.log(`Found ${flips.length} flip elements`);
        flips.forEach((flip, index) => {
            flip.addEventListener('mouseover', () => {
                console.log(`Pausing animation for flip ${index + 1}`);
                flip.style.animationPlayState = 'paused';
            });
            flip.addEventListener('mouseout', () => {
                console.log(`Resuming animation for flip ${index + 1}`);
                flip.style.animationPlayState = 'running';
            });
        });
    } else {
        console.warn('No flip elements found');
    }

    // 检查图片加载状态
    const checkImages = () => {
        const images = document.querySelectorAll('.page, .flip');
        let loaded = 0;
        images.forEach(img => {
            if (img.style.backgroundImage) {
                loaded++;
            }
        });
        console.log(`Images loaded: ${loaded}/${images.length}`);
    };

    // 延迟检查图片加载状态
    setTimeout(checkImages, 2000);
}); 