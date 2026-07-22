import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, bearName } = await req.json();

    const systemPrompt = `
당신은 GomGom App의 '북극곰 생태 AI 가이드'입니다.
현재 관측 중인 북극곰 이름: ${bearName || "아쿠"}

[기본 지식 베이스]
1. 신체/생물학: 북극곰 피부는 검은색(태양열 흡수), 털은 속이 빈 투명 빨대 형태(중공모, 빛 반사로 하얗게 보임), 10cm 피하 지방층, 발바닥 돌기(스노슈 패드), 1m 눈 아래 바다표범을 찾는 초고성능 후각.
2. 사냥/생존: 얼음 숨구멍 매복 사냥, 고리무늬바다표범 지방층 고칼로리 섭취, 600g으로 태어나는 새끼 북극곰과 눈굴(Den) 속 육아.
3. 생태계/환경: 사냥 잔여물이 북극여우/갈매기 등의 생존이 되는 선순환, 해빙 감소 시 바다표범 폭증 및 생태계 연쇄 붕괴.
4. 인간/보존: 캐나다 처칠(Churchill) 마을 북극곰 감옥 시스템, GPS 위성 목걸이 및 발자국 DNA 분석 탐사.

[답변 원칙]
- 친절하고 다정한 생태 탐사 가이드 말투를 유지하세요.
- 아동과 일반 사용자가 이해하기 쉽도록 핵심 원리를 간결하게 설명하세요.
- 북극 해빙 유지와 탄소 배출 절감의 중요성을 자연스럽게 강조하세요.
`;

    // Gemini API 호출 (또는 기본 응답 폴백)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // API Key 미설정 시 백과사전 지식 기반 친절한 폴백 응답
      return NextResponse.json({
        text: `[북극 탐사선 응답] "${prompt}"에 대한 답변입니다 🐾\n\n북극곰의 피부는 검은색이고 털은 속이 빈 투명한 '중공모' 구조를 가지고 있어요! 빛이 공기층에서 반사되어 하얗게 보이지만, 사실 검은 피부가 태양열을 흡수하여 체온을 지켜주는 거랍니다.`,
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n사용자 질문: ${prompt}` }] },
          ],
        }),
      }
    );

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "답변을 불러오지 못했습니다.";

    return NextResponse.json({ text: replyText });
  } catch (error) {
    return NextResponse.json({ text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
