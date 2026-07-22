import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, bearName } = await req.json();

    const systemPrompt = `
당신은 GomGom App의 '북극곰 생태 AI 가이드'입니다.
현재 관측 중인 북극곰 이름: ${bearName || "아쿠"}

[북극곰 4대 모듈 지식 베이스]
1. 모듈 1 (신체 & 생물학):
   - 투명한 털 & 검은 피부: 털은 속이 비어 있는 중공모(Hollow Core Hair)로 빛을 반사하여 하얗게 보이지만 실체는 투명함. 검은 피부는 태양열을 100% 흡수.
   - 단열 & 신체: 10cm 피하 지방층과 열 손실 최소화 신체 비율.
   - 스노슈 발바닥: 미끄럼 방지 파필래(돌기) 및 수영용 저어주기 패드.
   - 초고성능 후각: 눈속 1m 아래 바다표범 냄새 감지.

2. 모듈 2 (생태 & 생존 전략):
   - 사냥 기술: 얼음 숨구멍 매복 '존버 사냥' 및 흰 눈 위장.
   - 고칼로리 섭취: 고리무늬바다표범 지방층 고효율 에너지 메커니즘.
   - 육아: 600g으로 태어나는 새끼 북극곰과 눈굴(Den) 속 성장, 고지방 젖 공급.

3. 모듈 3 (지표종 & 환경):
   - 최상위 포식자 역할: 사냥 잔여물이 북극여우, 갈매기 등의 생존이 되는 선순환.
   - 해빙(Sea Ice): 단순 얼음이 아닌 사냥터이자 이동 도로.
   - 생태계 도미노: 북극곰 감소 -> 바다표범 폭증 -> 해양 생태계 연쇄 붕괴.

4. 모듈 4 (탐사 & 보존):
   - 탐사 기술: GPS 위성 목걸이 추적 & 발자국 DNA 분석.
   - 공존 사례: 캐나다 처칠(Churchill) 마을 '북극곰 감옥(Polar Bear Jail)' 시스템.
   - 실천 과제: 탄소 배출 절감과 북극 해빙 유지의 상관관계.

[답변 원칙]
- 친절하고 탐구심을 자극하는 다정한 전문가 말투를 사용하세요.
- 질문 내용에 맞는 모듈 정보를 활용하여 1~2단락으로 답변하세요.
- 북극 해빙 보존의 중요성을 자연스럽게 메시지에 담으세요.
`;

    // 1. Gemini API 키 확인 (환경변수 또는 로컬 OLLAMA 수위 스위칭)
    const apiKey = process.env.GEMINI_API_KEY;
    const llmProvider = process.env.LLM_PROVIDER || "gemini"; // "gemini" | "ollama"

    // [옵션 A/B 호환] 만약 추후 로컬 Ollama로 스위칭할 경우
    if (llmProvider === "ollama") {
      const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
      const ollamaRes = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "qwen2.5:7b",
          prompt: `${systemPrompt}\n\n사용자 질문: ${prompt}`,
          stream: false,
        }),
      });
      const ollamaData = await ollamaRes.json();
      return NextResponse.json({ text: ollamaData.response });
    }

    // [옵션 C] Gemini API 호출 (API Key 미설정 시 안전한 지식 폴백 응답)
    if (!apiKey) {
      return NextResponse.json({
        text: `[GomGom 생태 탐사선 응답] "${prompt}"에 대해 알아본 정보예요! 🐾\n\n북극곰의 피부는 사실 검은색이고 털은 속이 빈 투명한 '중공모' 구조입니다! 빛이 공기층에서 반사되어 눈에는 하얗게 보이지만, 사실 검은 피부가 태양열을 100% 흡수하여 혹한의 체온을 지켜준답니다.\n\n(💡 개발 팁: .env.local 파일에 GEMINI_API_KEY를 발급받아 넣으시면 실시간 AI 대화가 완벽히 구동됩니다!)`,
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
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "탐사선 통신 지연으로 응답을 생성하지 못했습니다.";

    return NextResponse.json({ text: replyText });
  } catch (error) {
    return NextResponse.json({ text: "시스템 통신 오류가 발생했습니다." }, { status: 500 });
  }
}
