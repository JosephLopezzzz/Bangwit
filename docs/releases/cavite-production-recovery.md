# Cavite Production recovery and source reconciliation

Recorded: 19 October 2026. This is a dated incident/recovery receipt, not a new Production release approval.

## Recorded publication and restoration

| Event | Verified identifier and scope |
| --- | --- |
| Policy/research update | `d16714501704b8d3197a6ef36a2a1fac070032a2`, `feat(pilot): update privacy policy and review packet`; included draft acknowledgment `prototype-5`. |
| Unexpected Production publication, 17 October | Vercel Ready deployment `En7WgD4FNLezbmWLhjZMHKR7rHUj`, `bangwit-9qt93o7qx-josephlopezzzzs-projects.vercel.app`, source shown as `main` / `d167145`. Both the review branch and remote `main` subsequently pointed to this commit; why `main` moved was not established. Do not infer a Git/Vercel defect from this record. |
| Owner decision | Joseph explicitly selected restoration to `cadbca7`. |
| Restoration completed, 17 October | Vercel **Promote** assigned `bangwit.vercel.app` to Ready deployment `4MytvJzrn7UseSmUM19eubP5MT7p`, source `cadbca7f96f359322a8bbf46f02d6bf2c5b960a8`, unique origin `bangwit-h1uuf79wi-josephlopezzzzs-projects.vercel.app`. Project overview and the public policy page were checked. No prototype agreement was accepted and no journal was erased. |
| Promotion behavior | Instant Rollback's final confirmation was not submitted. Normal Promote was used; the overview then displayed the usual update-through-`main` guidance. Do not describe automatic promotions as paused. |
| Remote source check, 19 October | `git ls-remote origin refs/heads/main refs/heads/codex/pilot-policy-review-20261017` returned `d167145` for both. No remote mutation was made during this follow-up. |
| Public corroboration, 19 October, `2026-10-19T10:28:14.178Z` | `/policies` returned 200; its 10 referenced JavaScript chunks exposed `prototype-4`, matching the old source's acknowledgment version. The two unique deployment origins returned 302 to Vercel protection. This is public HTTP/asset evidence, not fresh dashboard/SHA, worker, browser privacy or device acceptance. The current browser inventory has no signed-in Vercel tab. |

## Concrete local Git recovery

Recovery worktree: `work/bangwit-production-restore` beside the main checkout. Branch: `codex/restore-production-20261019`. Commit: `27b3b1b94810ff7155c203caf85ad0fe8001a280`, reverting `d167145` without rewriting shared history.

`git diff --exit-code cadbca7 HEAD` in that worktree returned zero with no differences. Thus its tracked file tree is identical to `cadbca7`, including the earlier draft policy. No new runtime test result is claimed for that identical tree. The recovery worktree is clean. The later policy/research work remains on `codex/pilot-policy-review-20261017`; the local draft there is `prototype-6` and requires review.

The managed-worktree helper could not create a checkout because the chat root is not itself a Git repository. The isolated worktree was created through Git from the actual nested repository. Nothing was deleted or moved.

## Publication decision still required

The prepared revert has **not** been pushed to GitHub or deployed. It is a concrete candidate to restore the `main` source to the same tree as Production while retaining the review branch. Publishing it to `main` can trigger another Production deployment, so it must be explicitly selected as the next release action after reviewing this receipt. Use a normal reviewed merge/fast-forward; do not force-push or reset shared history. Recheck remote `main` before publication and stop/rebase the proposal if another contributor has changed it.

After any authorized publication, inspect the actual Ready deployment and domain assignment, record its exact SHA/ID, run the hosted checker, and verify the changed scope at the Production origin. Preserve IndexedDB, user backups and site storage throughout. A future reviewed `prototype-6` release is separate from this recovery; it needs the policy/pilot gates described in the [review handoff](../CAVITE_PRIVACY_REVIEW_DECISIONS.md).
