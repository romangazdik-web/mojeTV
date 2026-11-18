# Moje TV – vlastní launcher pro TizenBrew

Experimentální český launcher navržený pro Samsung QE49Q7FAM (Tizen 3.0) a už nainstalované TizenBrew.

## Funkce
- Tmavá přehledná úvodní obrazovka, datum a čas.
- Přímá tlačítka StremioK a TizenTube (vyhledání mezi nainstalovanými moduly TizenBrew).
- Seznam ostatních modulů TizenBrew, ovládání dálkovým ovladačem.
- Žádné zprávy, reklamy, počasí, externí datové API ani požadavek na zapnutý PC.

## Instalace
1. Na GitHubu vytvoř **veřejný repozitář**, např. `moje-tv`.
2. Na jeho hlavní větev nahraj obsah této ZIP složky tak, aby `package.json` byl **přímo v kořeni repozitáře** a `app/index.html`, `app/style.css`, `app/app.js` v podsložce `app`.
3. Na televizi otevři TizenBrew → Module Manager → Add GitHub Module.
4. Zadej **tvoje-github-jmeno/moje-tv** (ne URL, ne `gh/`).
5. Spusť `Moje TV` v TizenBrew. Původní HomeDash nemusíš mazat.

**Nestav auto-start, dokud neotestuješ spuštění StremioK a TizenTube.**

## Omezení
- Experimentální balík nebyl fyzicky testován na televizi. Kód vychází z publikovaného rozhraní modulů TizenBrew a přístupů používaných v projektu HomeDash. Případné změny TizenBrew mohou vyžadovat úpravu.
- TizenTube/StremioK musí být nainstalované jako moduly ve stejném TizenBrew.
- Seznam zobrazuje moduly TizenBrew, nikoli všechny nativní aplikace Samsungu.
- Nemění firmware, nenahrazuje Tizen a nevyžaduje root.
