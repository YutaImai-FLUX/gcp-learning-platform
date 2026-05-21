/**
 * NTTデータ案件管理 — Google Apps Script API
 *
 * 【デプロイ手順】
 *  1. Apps Script エディタ (script.google.com) を開く
 *  2. このファイルの内容を Code.gs に貼り付け
 *  3. 右上「デプロイ」→「新しいデプロイ」
 *  4. 種類: ウェブアプリ
 *     実行ユーザー: 自分
 *     アクセス: 全員（匿名ユーザーを含む）
 *  5. デプロイ → 表示された URL を Next.js の GAS_API_URL に設定
 *
 * 【スプレッドシート構成】
 *  シート名: "projects" (自動作成されます)
 *  列: id | name | client | mainAssignee | subAssignee |
 *      presalesTemplateId | fdeTemplateId | milestones(JSON) |
 *      priority | status | description | createdAt
 */

const SHEET_NAME = 'projects';
const COLUMNS = 12;

// ─── シート取得 / 初期化 ──────────────────────────────────────────────────────

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'id', 'name', 'client', 'mainAssignee', 'subAssignee',
      'presalesTemplateId', 'fdeTemplateId', 'milestones',
      'priority', 'status', 'description', 'createdAt'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    // 列幅調整
    sheet.setColumnWidth(8, 400); // milestones (JSON)
  }
  return sheet;
}

// ─── HTTP ハンドラ ─────────────────────────────────────────────────────────────

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'getProjects') {
      return jsonOk(getAllProjects());
    }
    return jsonError('Unknown action', 400);
  } catch (err) {
    return jsonError(String(err), 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action } = data;

    if (action === 'createProject') {
      return jsonOk(insertProject(data.project));
    }
    if (action === 'updateProject') {
      const result = editProject(data.id, data.updates);
      if (!result) return jsonError('Project not found', 404);
      return jsonOk(result);
    }
    if (action === 'deleteProject') {
      const ok = removeProject(data.id);
      if (!ok) return jsonError('Project not found', 404);
      return jsonOk({ success: true });
    }
    return jsonError('Unknown action', 400);
  } catch (err) {
    return jsonError(String(err), 500);
  }
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message, _status) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Row ↔ Object 変換 ────────────────────────────────────────────────────────

function rowToProject(row) {
  let milestones = [];
  try { milestones = JSON.parse(row[7] || '[]'); } catch (_) {}
  return {
    id:                  String(row[0] || ''),
    name:                String(row[1] || ''),
    client:              String(row[2] || ''),
    mainAssignee:        String(row[3] || '今井'),
    subAssignee:         String(row[4] || ''),
    presalesTemplateId:  String(row[5] || 'ps-standard'),
    fdeTemplateId:       String(row[6] || ''),
    milestones:          milestones,
    priority:            String(row[8] || '中'),
    status:              String(row[9] || 'active'),
    description:         String(row[10] || ''),
    createdAt:           String(row[11] || ''),
  };
}

function projectToRow(p) {
  return [
    p.id                 || '',
    p.name               || '',
    p.client             || '',
    p.mainAssignee       || '今井',
    p.subAssignee        || '',
    p.presalesTemplateId || 'ps-standard',
    p.fdeTemplateId      || '',
    JSON.stringify(p.milestones || []),
    p.priority           || '中',
    p.status             || 'active',
    p.description        || '',
    p.createdAt          || '',
  ];
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

function getAllProjects() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet
    .getRange(2, 1, lastRow - 1, COLUMNS)
    .getValues()
    .filter(function(row) { return row[0]; })  // IDが空の行をスキップ
    .map(rowToProject);
}

function insertProject(project) {
  const sheet = getSheet();
  const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
  const newProject = Object.assign({}, project, {
    id:        project.id        || Utilities.getUuid(),
    createdAt: project.createdAt || now,
  });
  sheet.appendRow(projectToRow(newProject));
  return newProject;
}

function editProject(id, updates) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const idCol = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const idx = idCol.indexOf(id);
  if (idx === -1) return null;

  const sheetRow = idx + 2; // ヘッダー行(1) + 0始まり補正
  const existing = rowToProject(
    sheet.getRange(sheetRow, 1, 1, COLUMNS).getValues()[0]
  );
  const updated = Object.assign({}, existing, updates);
  sheet.getRange(sheetRow, 1, 1, COLUMNS).setValues([projectToRow(updated)]);
  return updated;
}

function removeProject(id) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const idCol = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const idx = idCol.indexOf(id);
  if (idx === -1) return false;

  sheet.deleteRow(idx + 2);
  return true;
}
