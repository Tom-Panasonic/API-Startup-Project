import { db, testConnection, closeConnection } from "../src/db/connection";
import { users } from "../src/db/schema";
import { config } from "dotenv";

// 環境変数を読み込み
config();

// サンプルユーザーデータ
const sampleUsers = [
  { name: "田中太郎", email: "taro.tanaka@example.com", age: 28 },
  { name: "佐藤花子", email: "hanako.sato@example.com", age: 25 },
  { name: "鈴木一郎", email: "ichiro.suzuki@example.com", age: 32 },
  { name: "高橋美咲", email: "misaki.takahashi@example.com", age: 29 },
  { name: "伊藤健太", email: "kenta.ito@example.com", age: 24 },
  { name: "山田愛", email: "ai.yamada@example.com", age: 31 },
  { name: "中村大輔", email: "daisuke.nakamura@example.com", age: 27 },
  { name: "小林真理", email: "mari.kobayashi@example.com", age: 26 },
  { name: "加藤雄一", email: "yuichi.kato@example.com", age: 35 },
  { name: "吉田麻衣", email: "mai.yoshida@example.com", age: 23 },
];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // データベース接続テスト
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }

    // 既存データを削除（開発環境のみ）
    if (process.env.NODE_ENV !== "production") {
      console.log("🧹 Clearing existing data...");
      await db.delete(users);
      console.log("✅ Existing data cleared");
    }

    // サンプルデータを挿入
    console.log("📝 Inserting sample users...");
    for (const user of sampleUsers) {
      try {
        await db.insert(users).values(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } catch (error) {
        console.error(`❌ Failed to create user: ${user.name}`, error);
      }
    }

    // 作成されたデータを確認
    const createdUsers = await db.select().from(users);
    console.log(
      `\n🎉 Successfully seeded database with ${createdUsers.length} users!`
    );

    // 作成されたユーザーの一覧を表示
    console.log("\n📋 Created users:");
    createdUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - Age: ${user.age}`
      );
    });
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    // データベース接続を閉じる
    await closeConnection();
    console.log("\n🔚 Database seeding completed");
  }
}

// スクリプト実行
seedDatabase();
