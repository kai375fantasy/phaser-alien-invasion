// MainMenuScene.js
class MainMenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MainMenuScene' });
    }
  
    create() {
        this.sound.stopAll();
        const bgMusic = this.registry.get('bgMusic');
        if (bgMusic && !bgMusic.isPlaying) {
            bgMusic.play();
        }
          
        this.add.image(400, 300, 'menuBackground').setOrigin(0.5, 0.5);

      // 1. 显示游戏标题
      this.add.text(300, 100, 'Alien Invasion', {
        fontSize: '32px',
        fontFamily: 'MuzaiPixel',
        color: '#ffffff'
      });
  
      // 2. 提示
      this.add.text(200, 200, 'Choose Your Difficulty:', {
        fontSize: '24px',
        fontFamily: 'MuzaiPixel',
        color: '#0f0'
      });
  
      // 3. 创建不同难度的文本按钮 (Easy / Medium / Hard)
      this.easyButton = this.add.text(250, 300, 'Easy', {
        fontSize: '28px',
        fontFamily: 'MuzaiPixel',
        color: '#00ff00'
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('PlayScene', { difficulty: 'easy' });
      });
  
      this.mediumButton = this.add.text(350, 300, 'Medium', {
        fontSize: '28px',
        fontFamily: 'MuzaiPixel',
        color: '#ffffff'
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('PlayScene', { difficulty: 'medium' });
      });
  
      this.hardButton = this.add.text(480, 300, 'Hard', {
        fontSize: '28px',
        fontFamily: 'MuzaiPixel',
        color: '#ff0000'
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('PlayScene', { difficulty: 'hard' });
      });
  
      // 4. 其他 UI (可选)：说明游戏操作键位
      this.add.text(200, 400, 'Use "W,A,S,D" Keys to move. Press SPACE to shoot.', {
        fontSize: '18px',
        fontFamily: 'MuzaiPixel',
        color: '#ffffff'
      });
    }
  }
  