// GameOverScene.js
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
  
    init(data) {
        // 从 PlayScene 传过来的分数
        this.finalScore = data.score || 0;
    }
  
    create() {
    const bgMusic = this.registry.get('bgMusic');
        if (bgMusic && bgMusic.isPlaying) {
            bgMusic.stop();
        }

        this.gameOverMusic = this.sound.add('gameOverMusic', { volume: 0.5 });
        this.gameOverMusic.play();

        // 1. 显示“Game Over”
        this.add.text(300, 200, 'Game Over', {
            fontSize: '40px',
            fontFamily: 'MuzaiPixel',
            color: '#ff0000'
        });
  
        // 2. 显示最终得分
        this.add.text(300, 300, `Score: ${this.finalScore}`, {
            fontSize: '24px',
            fontFamily: 'MuzaiPixel',
            color: '#ffffff'
        });
  
        // 3. 处理最高分 (High Score)
        let highScore = localStorage.getItem('alienInvasionHighScore') || 0;
        highScore = parseInt(highScore, 10);
  
        if (this.finalScore > highScore) {
            highScore = this.finalScore;
            localStorage.setItem('alienInvasionHighScore', highScore);
        }
  
        this.add.text(300, 350, `Highest Score: ${highScore}`, {
            fontSize: '24px',
            fontFamily: 'MuzaiPixel',
            color: '#00ff00'
        });
  
        // 4. 提示点击重新开始或返回主菜单
        this.add.text(250, 450, 'Click to return to Main Menu', {
            fontSize: '20px',
            fontFamily: 'MuzaiPixel',
            color: '#ffffff'
        });
  
        // 5. 点击屏幕 => 返回主菜单
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
  