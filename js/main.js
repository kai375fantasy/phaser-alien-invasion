const config = {
    type: Phaser.AUTO,    
    width: 800,           
    height: 600,          
    backgroundColor: '#000000', 
    scene: [ 
      BootScene, 
      MainMenuScene, 
      PlayScene, 
      GameOverScene 
    ],                  
    physics: {
      default: 'arcade',  
      arcade: {
        debug: false      // 调试模式：false 表示不显示碰撞边界
      }
    }
  };
  
  
  const game = new Phaser.Game(config);
  