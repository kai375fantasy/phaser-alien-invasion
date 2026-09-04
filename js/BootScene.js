// BootScene.js
class BootScene extends Phaser.Scene {
        constructor() {
        super({ key: 'BootScene' });
    }
  
    preload() {
        // 1. 预加载图片资源
        this.load.image('player', 'assets/images/starship.svg');
        this.load.image('enemy', 'assets/images/ufodark.svg');
        this.load.image('bullet', 'assets/images/projectile2.svg');
        this.load.image('enemyBullet', 'assets/images/projectile1.svg');

        this.load.image('menuBackground', 'assets/images/backgroundSpace_01.1.png');
        this.load.image('background', 'assets/images/Parallax100.png'); //无限循环

    
        // 2. 预加载音效
        this.load.audio('shoot', 'assets/audio/laser5.mp3');
        this.load.audio('explosion', 'assets/audio/SFX_Explosion_02.wav');
    
        // 可以在这里加载更多资源 (背景音乐、tilemap、spritesheet 等)
        this.load.audio('BGM', 'assets/audio/Orbital_Colossus.mp3')
        this.load.audio('gameOverMusic', 'assets/audio/Lost_signal_main_theme.mp3');
    }
  
    create() {
        // 3. 资源加载完成，进入主菜单
        const bgMusic = this.sound.add('BGM', { loop: true, volume: 0.2 });
        if (!bgMusic.isPlaying) {
            bgMusic.play();
        }

        // 将背景音乐存储到全局对象中
        this.registry.set('bgMusic', bgMusic);

            // 进入主菜单
        this.scene.start('MainMenuScene');
    }
  }
  
  // 导出类（如果需要在模块化环境中使用）
  