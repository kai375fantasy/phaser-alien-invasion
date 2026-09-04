class PlayScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PlayScene' });
    }
  
    init(data) {
        this.difficulty = data.difficulty || 'easy';
      
        // 根据难度设置敌人生成间隔
        if (this.difficulty === 'hard') {
          this.enemySpawnInterval = 1000;                   // 每 1 秒生成一个敌人
          this.enemySpeed = 100;                             // 敌人移动速度更快
        } else if (this.difficulty === 'medium') {
          this.enemySpawnInterval = 1500;                // 每 1.5 秒生成一个敌人
          this.enemySpeed = 70;                             // 中等移动速度
        } else {
          this.enemySpawnInterval = 2000;               // 每 2 秒生成一个敌人
          this.enemySpeed = 50;                         // 较慢移动速度
        }
      }
      
  
    create() {
      // 1. 启用世界物理边界
      this.physics.world.setBoundsCollision(true, true, true, true);
      this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

  
      // 2. 玩家角色
      this.player = this.physics.add.sprite(400, 550, 'player');
      this.player.setCollideWorldBounds(true);
      this.player.setScale(0.25);
      this.player.setOrigin(0.5, 0.5);
      // 根据你的原图再微调，下面只是示例数值
      this.player.body.setSize(64, 64);
      this.player.body.setOffset(222, 260);
  
      // 3. 子弹组（回收/复用）
      this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 20,         // 同时激活的子弹上限
        runChildUpdate: true // 若子弹有 update 方法可用
      });

        this.enemyBullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 20,         // 同时激活的子弹上限
            runChildUpdate: true // 若子弹有 update 方法可用
        });
    
      // 4. 敌人组（回收/复用）
      // 与子弹类似，这里 maxSize 先写成 10，表示一次场上最多 10 个敌人
      this.enemies = this.physics.add.group({
        defaultKey: 'enemy',
        maxSize: 10,
        runChildUpdate: true
      });
  
      // 5. 碰撞检测
      //   (a) 子弹与敌人
      this.physics.add.overlap(this.bullets, this.enemies, this.handleBulletEnemyCollision, null, this);
      //   (b) 玩家与敌人
      this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

      this.physics.add.overlap(this.enemyBullets, this.player, this.handleEnemyBulletPlayerCollision, null, this);

  
      // 6. 分数
      this.score = 0;
      this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', color: '#fff' });
  
      // 7. 输入控制
      this.wasdKeys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
      });
      this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
      // 8. 射击冷却
      this.lastFired = 0;
      this.fireRate = 300; // 每 300ms 一发
  
      // 9. 敌人生成定时
      //   我们来个最简单的做法：每隔 2 秒生成一个敌人
      this.nextEnemySpawnTime = 0;      // 记录下一次生成敌人的时间
      this.enemySpawnInterval = 2000;   // 生成间隔，单位毫秒
    }
  
    update(time, delta) {
        this.background.tilePositionY -= 2;

        // 1) 玩家移动
        this.handlePlayerMovement();
    
        // 2) 玩家射击：按住空格可连发
        if (this.spaceBar.isDown && time > this.lastFired) {
            this.shootBullet();
            this.lastFired = time + this.fireRate;
        }

        this.enemies.children.each((enemy) => {
            if (enemy.active && time > enemy.lastShotTime + 2000) { // 每隔 1000ms
                this.shootEnemyBullet(enemy);
                enemy.lastShotTime = time; // 更新上次射击时间
            }
        });

        // 回收飞出屏幕的敌人子弹
        this.enemyBullets.children.each((bullet) => {
            if (bullet.active && (bullet.y > 600 || bullet.y < 0 || bullet.x < 0 || bullet.x > 800)) {
                bullet.disableBody(true, true); // 回收子弹
            }
        });
    
        // 3) 回收飞出屏幕的子弹
        this.updateBullets();
    
        // 4) 敌人 AI + 生成逻辑
        this.updateEnemies(time);
    
        // 你也可以加别的全局逻辑
    }
  
    // ============== [玩家移动] ==============
    handlePlayerMovement() {
      this.player.setVelocity(0);
  
      if (this.wasdKeys.a.isDown) {
        this.player.setVelocityX(-200);
      } else if (this.wasdKeys.d.isDown) {
        this.player.setVelocityX(200);
      }
      if (this.wasdKeys.w.isDown) {
        this.player.setVelocityY(-200);
      } else if (this.wasdKeys.s.isDown) {
        this.player.setVelocityY(200);
      }
    }
  
    // ============== [子弹发射 + 回收] ==============
    shootBullet() {
        const bullet = this.bullets.get(this.player.x, this.player.y - 20);
        if (bullet) {
          bullet.enableBody(true, this.player.x, this.player.y - 20, true, true);
          bullet.setActive(true).setVisible(true);
          
          bullet.setScale(0.5);
          bullet.setOrigin(0.5, 0.5);
          bullet.body.setSize(30, 30);
          bullet.body.setOffset(128, 50);
      
          // 确保子弹向上飞行
          bullet.body.velocity.y = -600;
      
          // 播放音效
          this.sound.play('shoot');
        }
    }

    shootEnemyBullet(enemy) {
        const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20, 'enemyBullet'); // 子弹从敌人下方发射
        if (bullet) {
          bullet.enableBody(true, enemy.x, enemy.y + 20, true, true);
          bullet.setActive(true).setVisible(true);
          bullet.setScale(0.5);
          bullet.setOrigin(0.5, 0.5);
          bullet.body.setSize(30, 130);
          bullet.body.setOffset(108, 50);
      
          // 子弹向下飞行
          bullet.body.velocity.y = 300;
      
          // 如果有发射音效
          this.sound.play('shoot');
        }
    }
      
  
    updateBullets() {
        this.bullets.children.each((bullet) => {
          if (bullet.active) {
            // 若子弹中心 + 高度的一半飞到画面上方
            // 画面上方可以设 0 或 -50 做个缓冲
            if (bullet.y + bullet.displayHeight / 2 < 0) {
              bullet.disableBody(true, true);
            }
          }
        });
      }
      
    // ============== [敌人回收 + 无限生成] ==============
    updateEnemies(time) {
      // 1) 回收飞出屏幕或其他条件的敌人
      //   这里仅演示"如果某敌人跑到最底下就回收"的情况
      this.enemies.children.each((enemy) => {
        if (enemy.active && enemy.y > 600) {
          enemy.disableBody(true, true);
        }
      });
  
      // 2) 定时生成新的敌人
      if (time > this.nextEnemySpawnTime) {
        const enemyCount = this.difficulty === 'hard' ? 3 : this.difficulty === 'medium' ? 2 : 1;
        this.spawnMultipleEnemies(enemyCount);
        this.nextEnemySpawnTime = time + this.enemySpawnInterval;
      }
      
      //differernt diff
      this.enemies.children.each((enemy) => {
        if (enemy.active) {
          if (this.difficulty === 'easy') {
            // 简单模式：随机移动 ez
            enemy.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
          } else if (this.difficulty === 'medium') {
            // 中等模式：偶尔追踪玩家 medium
            if (Phaser.Math.Between(0, 100) > 70) {
              this.physics.moveToObject(enemy, this.player, this.enemySpeed);
            }
          } else {
            // 困难模式：始终追踪玩家 hard
            this.physics.moveToObject(enemy, this.player, this.enemySpeed);
          }
        }
      });
    
    }
  
    spawnOneEnemy() {
      // 用 group.get(...) 拿一个可用的敌人对象
      // 若 maxSize 已达上限且无可用对象，会返回 null
      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(50, 300);
      const enemy = this.enemies.get(x, y);
  
      if (enemy) {
        enemy.enableBody(true, x, y, true, true);
        // 设置外观与碰撞盒
        enemy.setScale(0.15);
        enemy.setOrigin(0.5, 0.5);
        enemy.body.setSize(500, 500);
        enemy.body.setOffset(10, 10);

        //effects
        enemy.setAlpha(0);
        this.tweens.add({
        targets: enemy,
        alpha: 1,
        duration: 1000,
        ease: 'Linear'
        });

        // 设置敌人射击冷却时间
        enemy.lastShotTime = 0;
  
        const speed = Phaser.Math.Between(this.enemySpeed - 20, this.enemySpeed + 20);
        this.physics.moveToObject(enemy, this.player, speed);

        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1, 1);
      }
    }

    spawnMultipleEnemies(count) {
        for (let i = 0; i < count; i++) {
          this.spawnOneEnemy();
        }
      }
      
  
    // ============== [碰撞逻辑] ==============
    handleBulletEnemyCollision(bullet, enemy) {
      // 子弹回收
      bullet.disableBody(true, true);
      // 敌人也回收
      enemy.disableBody(true, true);
  
      // 加分
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
  
      this.sound.play('explosion');
    }

    handleEnemyBulletPlayerCollision(player, bullet) {
        // 子弹回收
        bullet.disableBody(true, true);
      
        // 处理玩家受伤或游戏结束
        this.scene.start('GameOverScene', { score: this.score });
    }
  
    handlePlayerEnemyCollision(player, enemy) {
      // 撞到玩家 => 结束游戏
      this.scene.start('GameOverScene', { score: this.score });
    }
  }
  